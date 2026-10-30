// Reference proposal: adapt into the actual Customer test source set when it exists.
// Requires JUnit Jupiter and a running, isolated Customer test instance.
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Objects;
import org.junit.jupiter.api.Test;

class CustomerPatchUnauthorizedTest {
    @Test
    void patchCustomerWithoutBearerTokenReturns401() throws Exception {
        String baseUrl = Objects.requireNonNull(System.getenv("CUSTOMER_BASE_URL"),
                "Set CUSTOMER_BASE_URL to the isolated Customer test instance");
        String path = "/api/v1/customers/750e8400-e29b-41d4-a716-446655440000";
        HttpRequest request = HttpRequest.newBuilder(URI.create(baseUrl + path))
                .header("Content-Type", "application/json")
                .method("PATCH", HttpRequest.BodyPublishers.ofString("{\"name\":\"Test\"}"))
                .build(); // Intentionally no Authorization header.
        HttpResponse<String> response = HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());
        assertEquals(401, response.statusCode());
    }
}
