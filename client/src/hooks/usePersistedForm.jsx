import { useEffect } from "react";

/**
 * A custom hook that helps save form input data to localStorage
 * and load it back later.
 *
 * It watches form values and automatically saves changes.
 * It skips any fields are marked as sensitive for example passwords.
 *
 * Parameters:
 *  - watch: a function from react-hook-form that tracks form value changes.
 *  - reset: a function to update the form values.
 *  - storageIdentifier: the key name under which the form data is saved
 *    in localStorage (defaults to "formData").
 *  - sensitiveFields: an array of field names you want to exclude
 *    from saving like passwords.
 */

export const usePersistedForm = (
  watch,
  reset,
  storageIdentifier = "formData",
  sensitiveFields = [],
) => {
  useEffect(() => {
    const persisted = localStorage.getItem(storageIdentifier);
    const parsed = JSON.parse(persisted || {});
    reset(parsed);
  }, [reset, storageIdentifier]);

  useEffect(() => {
    const subscription = watch((value) => {
      const dataToPersist = { ...value };
      sensitiveFields.forEach((field) => delete dataToPersist[field]);
      localStorage.setItem(storageIdentifier, JSON.stringify(dataToPersist));
    });

    return () => subscription.unsubscribe();
  }, [watch, storageIdentifier, sensitiveFields]);
};

export default usePersistedForm;
