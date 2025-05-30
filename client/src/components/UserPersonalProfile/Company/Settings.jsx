import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../../../contexts/UserContext";
import { uploadFileToCloudinary } from "../../../util/cloudinaryUpload";
import styles from "../Shared/settings.module.css";
import FeedbackMessage from "../Shared/SettingsSections/FeedbackMessage";
import ProfilePhotoSection from "../Shared/SettingsSections/ProfilePhotoSection";
import EmailLocationPassword from "../Shared/SettingsSections/EmailLocationPassword";
import ArrayInputSection from "../Shared/SettingsSections/ArrayInputSection";
import CompanyDetailsSection from "./CompanyDetailsSection";
import { arrayFromString } from "../../../util/arrayFromString";

const Settings = () => {
  const { user, updateProfile, loading } = useUser();

  const [feedback, setFeedback] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Clear feedback and error messages
  useEffect(() => {
    if (feedback || uploadError) {
      const timer = setTimeout(() => {
        setFeedback("");
        setUploadError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback, uploadError]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: user.email,
      password: "",
      location: user.location,
      profilePhoto: null,
      companyName: user.companyProfile.companyName,
      website: user.companyProfile.website,
      industry: user.companyProfile.industry,
      about: user.companyProfile.about,
      companySize: user.companyProfile.companySize,
      tagline: user.companyProfile.tagline,
      headquarters: user.companyProfile.headquarters,
      branches: user.companyProfile.branches?.join(", ") || "",
      values: user.companyProfile.values?.join(", ") || "",
    },
  });

  //later will be ajdusted to handle loading state better
  if (loading || !user || !user.companyProfile) {
    return <div>Loading...</div>;
  }
  const onSubmit = async (data) => {
    setIsProcessing(true);
    setFeedback("");
    setUploadError("");

    try {
      const updatePayload = {};
      const companyProfileUpdates = {};

      //  user fields
      if (dirtyFields.email && data.email !== user.email)
        updatePayload.email = data.email;
      if (dirtyFields.password && data.password)
        updatePayload.password = data.password;
      if (dirtyFields.location && data.location !== user.location)
        updatePayload.location = data.location;

      // Profile photo
      if (data.profilePhoto && data.profilePhoto.length > 0) {
        const uploadedPhotoUrl = await uploadFileToCloudinary(
          data.profilePhoto[0],
        );
        if (uploadedPhotoUrl && uploadedPhotoUrl !== user.profilePhoto) {
          updatePayload.profilePhoto = uploadedPhotoUrl;
        }
      }

      // Company profile fields
      if (
        dirtyFields.companyName &&
        data.companyName !== user.companyProfile.companyName
      )
        companyProfileUpdates.companyName = data.companyName;
      if (dirtyFields.website && data.website !== user.companyProfile.website)
        companyProfileUpdates.website = data.website;
      if (
        dirtyFields.industry &&
        data.industry !== user.companyProfile.industry
      )
        companyProfileUpdates.industry = data.industry;
      if (dirtyFields.about && data.about !== user.companyProfile.about)
        companyProfileUpdates.about = data.about;
      if (
        dirtyFields.companySize &&
        data.companySize !== user.companyProfile.companySize
      )
        companyProfileUpdates.companySize = data.companySize;
      if (dirtyFields.tagline && data.tagline !== user.companyProfile.tagline)
        companyProfileUpdates.tagline = data.tagline;
      if (
        dirtyFields.headquarters &&
        data.headquarters !== user.companyProfile.headquarters
      )
        companyProfileUpdates.headquarters = data.headquarters;

      // Arrays
      if (dirtyFields.branches) {
        const branchesArr = arrayFromString(data.branches);
        if (
          JSON.stringify(branchesArr) !==
          JSON.stringify(user.companyProfile.branches)
        )
          companyProfileUpdates.branches = branchesArr;
      }
      if (dirtyFields.values) {
        const valuesArr = arrayFromString(data.values);
        if (
          JSON.stringify(valuesArr) !==
          JSON.stringify(user.companyProfile.values)
        )
          companyProfileUpdates.values = valuesArr;
      }

      //  companyProfile
      if (Object.keys(companyProfileUpdates).length > 0) {
        updatePayload.companyProfile = companyProfileUpdates;
      }

      // If nothing changed, exit
      if (Object.keys(updatePayload).length === 0) {
        setFeedback("No changes to update.");
        setIsProcessing(false);
        return;
      }

      //  send update request
      await updateProfile(updatePayload);

      setFeedback("Profile updated successfully!");
      reset(undefined, { keepValues: true });
    } catch {
      setUploadError("Failed to update profile. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className={styles.settingsWrapper}>
      <h1 className={styles.settingsTitle}>Edit Company Profile</h1>
      <FeedbackMessage feedback={feedback} uploadError={uploadError} />

      <form className={styles.settingsForm} onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "2rem" }}>
          <ProfilePhotoSection
            profilePhotoUrl={user.profilePhoto}
            control={control}
            errors={errors}
            isProcessing={isProcessing}
          />
        </div>

        <div className={styles.companyFormGrid}>
          <CompanyDetailsSection
            register={register}
            errors={errors}
            isProcessing={isProcessing}
          />
          <div>
            <EmailLocationPassword
              register={register}
              errors={errors}
              watch={watch}
              isProcessing={isProcessing}
              showLocation={true}
              defaultLocation={user.location}
            />
            <ArrayInputSection
              label="Branches (comma separated):"
              name="branches"
              isProcessing={isProcessing}
              register={register}
              errors={errors}
              validate={(value) => {
                const arr = arrayFromString(value);
                if (arr.length > 10)
                  return "You can add up to 10 branches only";
                if (arr.some((s) => s.length > 50))
                  return "Each branch must be less than 50 characters";
                return true;
              }}
              placeholder="e.g. Amsterdam, Utrecht"
            />
            <ArrayInputSection
              label="Company Values (comma separated):"
              name="values"
              register={register}
              errors={errors}
              isProcessing={isProcessing}
              validate={(value) => {
                const arr = arrayFromString(value);
                if (arr.length > 10) return "You can add up to 10 values only";
                if (arr.some((s) => s.length > 50))
                  return "Each value must be less than 50 characters";
                return true;
              }}
              placeholder="e.g. Innovation, Integrity, Teamwork"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || isProcessing}
        >
          {isSubmitting || isProcessing ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
