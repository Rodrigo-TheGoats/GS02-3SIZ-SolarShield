import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 10,
  duration: "10s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const res = http.get("http://localhost/api/space-weather/current");
  check(res, {
    "status is 200": (r) => r.status === 200,
    "status is 429": (r) => r.status === 429,
    "transaction time < 500ms": (r) => r.timings.duration < 500,
  });
  sleep(1);
}
