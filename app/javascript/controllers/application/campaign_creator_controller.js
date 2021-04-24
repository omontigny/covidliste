import { Controller } from "stimulus";
import Rails from "@rails/ujs";
import { debounce } from "lodash";

export default class extends Controller {
  static values = {
    simulatePath: String,
    maxDistanceInKm: Number,
  };
  static targets = [
    "minAge",
    "maxAge",
    "maxDistance",
    "availableDoses",
    "vaccineType",
    "simulationResult",
    "simulateButton",
    "submitButton",
  ];
  static classes = ["loadingReach"];

  recomputeReachAbortController = new AbortController();

  formChanged(e) {
    const errors = this.allErrors();
    if (errors.length) {
      console.error("Form has errors");
    } else {
      this.element.classList.add(this.loadingReachClass);
      // TODO : Cancel previous recomputations when form value has changed
      this.debouncedRemcomputeReach();
    }
  }

  async recomputeReach() {
    console.log("recompute");
    const reachRequestResult = await fetch(this.simulatePathValue, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "X-CSRF-Token": Rails.csrfToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        campaign: {
          min_age: this.minAge(),
          max_age: this.maxAge(),
          max_distance_in_meters: this.maxDistance() * 1000,
          available_doses: this.availableDoses(),
          vaccine_type: this.vaccineType(),
        },
      }),
    }).then((data) => data.json());
    alert(reachRequestResult.reach);
    this.element.classList.remove(this.loadingReachClass);
  }

  debouncedRemcomputeReach = debounce(this.recomputeReach, 500);

  minAge = () => parseInt(this.minAgeTarget.value) || 0;
  maxAge = () => parseInt(this.maxAgeTarget.value) || 0;
  availableDoses = () => parseInt(this.availableDosesTarget.value) || 0;
  vaccineType = () => this.vaccineTypeTarget.value || "";
  maxDistance = () => parseInt(this.maxDistanceTarget.value) || 0;

  minAgeErrors() {
    return [];
  }

  maxAgeErrors() {
    return [];
  }

  availableDosesErrors() {
    return [];
  }

  vaccineTypeErrors() {
    return [];
  }

  maxDistanceErrors() {
    return [];
  }

  allErrors() {
    return [
      ...this.minAgeErrors(),
      ...this.maxAgeErrors(),
      ...this.availableDosesErrors(),
      ...this.vaccineTypeErrors(),
      ...this.maxDistanceErrors(),
    ];
  }
}
