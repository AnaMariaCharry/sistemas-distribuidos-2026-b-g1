# Customer security CI proposal

This is a proposal for the documented Java/Spring Boot Customer API, not evidence of a running service or security controls. `security.yml` is intentionally in this workshop folder: GitHub Actions discovers workflows only in `.github/workflows/`, so it will not run automatically here.

## Scope and prerequisites

- Story: [issue #65](https://github.com/code-corhuila/bysellens-docs/issues/65), the criterion requiring HTTP 401 for a missing or invalid token. This reference covers **PATCH without a Bearer JWT** only; DELETE, invalid tokens, 403, forged headers and unchanged data need separate tests.
- The fork has no verified Customer Java service. CP8 adds an isolated Maven lab below; it is not the real Customer backend.
- To integrate later, identify the real Customer repository and its build/test source set, Java version and JUnit Jupiter dependencies. Start an isolated Customer test instance with the documented security configuration. Never use real customer data.
- Set `CUSTOMER_BASE_URL` to that instance's origin without a trailing slash. The fixed UUID is a test identifier; an authentication filter must reject the request before business processing.

## Running after integration

1. Adapt `CustomerPatchUnauthorizedTest.java` into the actual Customer project's test source set and ensure its test dependencies and build include it. Start the isolated service using that project's documented instructions.
2. Set `CUSTOMER_BASE_URL` in the environment. From the real Maven project directory, run `mvn -B -Dtest=CustomerPatchUnauthorizedTest -DfailIfNoTests=true test`. If the real build uses Gradle, use its documented test command instead. A reachable running instance is required; a connection failure is not a passing test.
3. To adopt the workflow, copy it to the actual code repository's `.github/workflows/`, set `CUSTOMER_SERVICE_DIR` to its verified Maven project directory, configure `CUSTOMER_BASE_URL`, start the isolated service in CI, and place the adapted test in its test source set. Review Java and action versions for that repository. Empty settings intentionally fail rather than silently skip the controls.
4. The proposed Maven audit runs OWASP Dependency-Check with a CVSS 7 threshold. It needs network access to vulnerability data; an NVD API key and caching may be needed under rate limits. Adapt to Gradle if that is the actual build. Gitleaks scans checked-out history; review its token and license requirements for the target repository.

## Verification status

CP4 checked YAML parsing, the presence of the three proposed controls, the Customer PATCH path and the expected 401 in the reference test. CP8 results for the isolated lab are recorded below. The real Customer backend, Maven vulnerability audit, Gitleaks scan and GitHub Actions execution remain unverified.

## CP8: isolated execution on this machine

Java 21.0.11 and Maven 3.9.11 were available. The lab `customer-security-lab/` uses Spring Boot 3.2.5 and Spring Security with an endpoint stub and no database. Its Maven configuration compiles and executes the original `../CustomerPatchUnauthorizedTest.java` without replacing it.

In PowerShell, from `customer-security-lab/`, start the lab in one terminal:

```powershell
mvn -B spring-boot:run '-Dspring-boot.run.arguments=--server.port=18089'
```

When the server has started, in another terminal in the same directory:

```powershell
$env:CUSTOMER_BASE_URL='http://localhost:18089'
mvn -B -Dtest=CustomerPatchUnauthorizedTest -DfailIfNoTests=true test
```

Actual Maven console excerpt from 2026-10-29 (the assertion checks that the HTTP response is 401):

```text
[INFO] Running CustomerPatchUnauthorizedTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.430 s -- in CustomerPatchUnauthorizedTest
[INFO]
[INFO] Results:
[INFO]
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  7.337 s
[INFO] Finished at: 2026-10-29T23:22:48-05:00
```

The initial offline server start (`mvn -o -B spring-boot:run '-Dspring-boot.run.arguments=--server.port=18089'`) failed because `spring-boot-starter-test:3.2.5` was not cached. The subsequent online command above downloaded the required dependencies and started the lab. Stop the lab with Ctrl+C after the test.

### Workflow validation

`actionlint` was not found on PATH. From `04-security-ci/`, JShell parsed `security.yml` with the locally installed SnakeYAML 2.6 jar and checked for `jobs` and `on` (SnakeYAML may interpret `on` as a YAML 1.1 boolean):

```powershell
$script = @(
  'import org.yaml.snakeyaml.Yaml;',
  'import java.nio.file.*;',
  'import java.util.*;',
  'var doc = (Map<?, ?>) new Yaml().load(Files.readString(Path.of("security.yml")));',
  'System.out.println("YAML_OK=" + (doc != null && doc.containsKey("jobs") && (doc.containsKey("on") || doc.containsKey(Boolean.TRUE))));',
  '/exit'
)
$script | jshell --class-path 'C:\Users\anita\.m2\repository\org\yaml\snakeyaml\2.6\snakeyaml-2.6.jar' -s
```

Actual output: `YAML_OK=true`. An initial sandboxed JShell invocation failed to write Windows preferences; the successful run used elevated execution. Parsing establishes YAML syntax only; it does **not** validate GitHub Actions semantics or run the workflow. The jar path is specific to this machine.

### Limits

The lab deliberately rejects anonymous requests through Spring Security and provides a stub PATCH endpoint; it does not implement JWT verification, ADMIN accounts, persistence or actual Customer business logic. The 401 result does not prove behavior of By_Sellens Customer. A 403 case and verification that real customer records remain unchanged were not implemented or tested. The proposal workflow was not executed and still requires integration with the real service, including starting a test target and setting its paths.
