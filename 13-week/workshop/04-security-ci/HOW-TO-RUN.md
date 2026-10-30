# Customer security CI proposal

This is a proposal for the documented Java/Spring Boot Customer API, not evidence of a running service or security controls. `security.yml` is intentionally in this workshop folder: GitHub Actions discovers workflows only in `.github/workflows/`, so it will not run automatically here.

## Scope and prerequisites

- Story: [issue #65](https://github.com/code-corhuila/bysellens-docs/issues/65), the criterion requiring HTTP 401 for a missing or invalid token. This reference covers **PATCH without a Bearer JWT** only; DELETE, invalid tokens, 403, forged headers and unchanged data need separate tests.
- The fork has no verified Customer Java service, Maven or Gradle build. The Java file is a reference test, not an executable test in this folder.
- To integrate later, identify the real Customer repository and its build/test source set, Java version and JUnit Jupiter dependencies. Start an isolated Customer test instance with the documented security configuration. Never use real customer data.
- Set `CUSTOMER_BASE_URL` to that instance's origin without a trailing slash. The fixed UUID is a test identifier; an authentication filter must reject the request before business processing.

## Running after integration

1. Adapt `CustomerPatchUnauthorizedTest.java` into the actual Customer project's test source set and ensure its test dependencies and build include it. Start the isolated service using that project's documented instructions.
2. Set `CUSTOMER_BASE_URL` in the environment. From the real Maven project directory, run `mvn -B -Dtest=CustomerPatchUnauthorizedTest -DfailIfNoTests=true test`. If the real build uses Gradle, use its documented test command instead. A reachable running instance is required; a connection failure is not a passing test.
3. To adopt the workflow, copy it to the actual code repository's `.github/workflows/`, set `CUSTOMER_SERVICE_DIR` to its verified Maven project directory, configure `CUSTOMER_BASE_URL`, start the isolated service in CI, and place the adapted test in its test source set. Review Java and action versions for that repository. Empty settings intentionally fail rather than silently skip the controls.
4. The proposed Maven audit runs OWASP Dependency-Check with a CVSS 7 threshold. It needs network access to vulnerability data; an NVD API key and caching may be needed under rate limits. Adapt to Gradle if that is the actual build. Gitleaks scans checked-out history; review its token and license requirements for the target repository.

## Verification status

Local checks for this submission: YAML parsing, presence of the three proposed controls, the real Customer PATCH path and the expected 401 in the reference test. No Customer backend, service dependencies or test server were available here. The authorization test, Maven vulnerability audit, Gitleaks scan and GitHub Actions execution were not run; their results remain pending.
