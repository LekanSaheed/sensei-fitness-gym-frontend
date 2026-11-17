export type DeviceLocation = {
  latitude: number;
  longitude: number;
  /** Precision of the reading in metres */
  accuracy: number;
};

export class LocationError extends Error {
  constructor(
    public reason: "unsupported" | "insecure" | "denied" | "unavailable" | "timeout",
    message: string
  ) {
    super(message);
  }
}

/**
 * Ask the browser for one fresh, high-accuracy location reading.
 * Rejects with a LocationError whose message can be shown to the user.
 */
export const getDeviceLocation = (timeout = 15000): Promise<DeviceLocation> =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      return reject(
        new LocationError(
          "unsupported",
          "This browser can't share your location. Try another browser or ask the front desk to check you in."
        )
      );
    }

    if (!window.isSecureContext) {
      return reject(
        new LocationError(
          "insecure",
          "Location only works on a secure (https) connection."
        )
      );
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          return reject(
            new LocationError(
              "denied",
              "Location access is blocked. Allow location for this site in your browser settings, then try again."
            )
          );
        }

        if (err.code === err.TIMEOUT) {
          return reject(
            new LocationError(
              "timeout",
              "Getting your location took too long. Move near a window or the entrance and try again."
            )
          );
        }

        reject(
          new LocationError(
            "unavailable",
            "We couldn't get your location. Turn on location services (GPS) and try again."
          )
        );
      },
      { enableHighAccuracy: true, timeout, maximumAge: 0 }
    );
  });

export const formatMeters = (m: number) =>
  m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
