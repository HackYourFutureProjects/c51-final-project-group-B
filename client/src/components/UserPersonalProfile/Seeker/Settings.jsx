import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useUser } from "../../../contexts/UserContext";
import { uploadFileToCloudinary } from "../../../util/cloudinaryUpload";
import { arrayFromString } from "../../../util/arrayFromString";

import styles from "../Shared/settings.module.css";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import ArrayInputSection from "../Shared/SettingsSections/ArrayInputSection";
import FeedbackMessage from "../Shared/SettingsSections/FeedbackMessage";
import ProfilePhotoSection from "../Shared/SettingsSections/ProfilePhotoSection";
import EmailLocationPassword from "../Shared/SettingsSections/EmailLocationPassword";
import ResumeSection from "./ResumeSection";
import PersonalDetailsSection from "./PersonalDetailsSection";
import DeleteAccountButton from "../Shared/SettingsSections/DeleteAccountButton";

const SeekerSettings = () => {
  const { user, updateProfile, loading, deleteAccount } = useUser();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // clear feedback and error messages
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
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: user.email,
      password: "",
      location: user.location,
      firstName: user.seekerProfile.firstName,
      lastName: user.seekerProfile.lastName,
      position: user.seekerProfile.position,
      bio: user.seekerProfile.bio,
      skills: user.seekerProfile.skills?.join(", ") || "",
      languages: user.seekerProfile.languages?.join(", ") || "",
      preferences: user.seekerProfile.preferences?.join(", ") || "",
      experiences: user.seekerProfile.experiences || [],
      education: user.seekerProfile.education || [],
      profilePhoto: null,
      resume: null,
    },
  });

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({
    control,
    name: "experiences",
  });
  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: "education",
  });

  // later will add a spinner
  if (loading || !user || !user.seekerProfile) {
    return <div>Loading...</div>;
  }
  const onSubmit = async (data) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setFeedback("");
    setUploadError("");
    try {
      const updatePayload = {};

      // base fields
      if (dirtyFields.email && data.email !== user.email)
        updatePayload.email = data.email;
      if (dirtyFields.password && data.password.trim().length >= 8)
        updatePayload.password = data.password;
      // location field
      if (dirtyFields.location && data.location !== user.location)
        updatePayload.location = data.location;

      //  profile fields
      const seekerProfileUpdates = {};
      if (
        dirtyFields.firstName &&
        data.firstName !== user.seekerProfile.firstName
      )
        seekerProfileUpdates.firstName = data.firstName;
      if (dirtyFields.lastName && data.lastName !== user.seekerProfile.lastName)
        seekerProfileUpdates.lastName = data.lastName;
      if (dirtyFields.position && data.position !== user.seekerProfile.position)
        seekerProfileUpdates.position = data.position;
      if (dirtyFields.bio && data.bio !== user.seekerProfile.bio)
        seekerProfileUpdates.bio = data.bio;

      // Arrays
      if (dirtyFields.skills) {
        const skillsArr = arrayFromString(data.skills);
        if (
          JSON.stringify(skillsArr) !==
          JSON.stringify(user.seekerProfile.skills)
        )
          seekerProfileUpdates.skills = skillsArr;
      }
      if (dirtyFields.languages) {
        const languagesArr = arrayFromString(data.languages);
        if (
          JSON.stringify(languagesArr) !==
          JSON.stringify(user.seekerProfile.languages)
        )
          seekerProfileUpdates.languages = languagesArr;
      }
      if (dirtyFields.preferences) {
        const preferencesArr = arrayFromString(data.preferences);
        if (
          JSON.stringify(preferencesArr) !==
          JSON.stringify(user.seekerProfile.preferences)
        )
          seekerProfileUpdates.preferences = preferencesArr;
      }
      if (dirtyFields.experiences) {
        if (
          JSON.stringify(data.experiences) !==
          JSON.stringify(user.seekerProfile.experiences)
        ) {
          seekerProfileUpdates.experiences = data.experiences;
        }
      }
      if (dirtyFields.education) {
        if (
          JSON.stringify(data.education) !==
          JSON.stringify(user.seekerProfile.education)
        ) {
          seekerProfileUpdates.education = data.education;
        }
      }

      // Profile Photo
      if (data.profilePhoto && data.profilePhoto.length > 0) {
        const uploadedPhotoUrl = await uploadFileToCloudinary(
          data.profilePhoto[0],
        );

        if (uploadedPhotoUrl && uploadedPhotoUrl !== user.profilePhoto) {
          updatePayload.profilePhoto = uploadedPhotoUrl;
        }
      }

      // Resume / CV (PDF only)
      if (data.resume && data.resume.length > 0) {
        const cvFile = data.resume[0];
        if (cvFile.type !== "application/pdf") {
          setError("resume", {
            type: "manual",
            message: "CV must be a PDF file.",
          });
          setIsProcessing(false);
          return;
        }
        const uploadedResumeUrl = await uploadFileToCloudinary(cvFile);
        if (
          uploadedResumeUrl &&
          uploadedResumeUrl !== user.seekerProfile.resumeUrl
        ) {
          seekerProfileUpdates.resumeUrl = uploadedResumeUrl;
        }
      }

      if (Object.keys(seekerProfileUpdates).length > 0) {
        updatePayload.seekerProfile = seekerProfileUpdates;
      }

      if (Object.keys(updatePayload).length === 0) {
        setFeedback("No changes detected.");
        setIsProcessing(false);
        return;
      }

      await updateProfile(updatePayload);
      setFeedback("Profile updated successfully!");
      // Reset the form values to the updated user data
      reset(data, { keepValues: true });
    } catch (error) {
      setUploadError(
        error.message || "Something went wrong while updating the profile.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.settingsWrapper}>
      <h1 className={styles.settingsTitle}>Edit Your Profile</h1>

      {/* Feedback error messages */}
      <FeedbackMessage feedback={feedback} uploadError={uploadError} />

      <form className={styles.settingsForm} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGrid}>
          {/* Photo & CV section */}
          <ProfilePhotoSection
            profilePhotoUrl={user.profilePhoto}
            control={control}
            errors={errors}
            isProcessing={isProcessing}
          />
          <ResumeSection
            resumeUrl={user.seekerProfile.resumeUrl}
            control={control}
            errors={errors}
            isProcessing={isProcessing}
          />
          {/* Email, Password section */}
          <EmailLocationPassword
            register={register}
            errors={errors}
            watch={watch}
            isProcessing={isProcessing}
            showLocation={true}
            defaultLocation={user.location}
          />

          {/*Personal details section */}

          <PersonalDetailsSection
            register={register}
            errors={errors}
            isProcessing={isProcessing}
          />

          {/* Skills, Languages, Preferences  */}
          <ArrayInputSection
            label="Skills (comma separated):"
            name="skills"
            register={register}
            errors={errors}
            validate={(value) => {
              const arr = arrayFromString(value);
              if (arr.length > 20) return "You can add up to 20 skills only";
              if (arr.some((s) => s.length > 50))
                return "Each skill must be less than 50 characters";
              return true;
            }}
            placeholder="e.g. JavaScript, React, Node.js"
          />
          <ArrayInputSection
            label="Languages (comma separated):"
            name="languages"
            register={register}
            errors={errors}
            validate={(value) => {
              const arr = arrayFromString(value);
              if (arr.length > 20) return "You can add up to 20 languages only";
              if (arr.some((s) => s.length > 50))
                return "Each language must be less than 50 characters";
              return true;
            }}
            placeholder="e.g. English, Spanish"
          />

          <ArrayInputSection
            label="Preferences (comma separated):"
            name="preferences"
            register={register}
            errors={errors}
            validate={(value) => {
              const arr = arrayFromString(value);
              if (arr.length > 20)
                return "You can add up to 20 preferences only";
              if (arr.some((s) => s.length > 50))
                return "Each preference must be less than 50 characters";
              return true;
            }}
            placeholder="e.g. Remote, Full-time"
          />
        </div>

        {/* Experiences section and educations */}

        <div className={styles.expEduGrid}>
          <ExperienceSection
            expFields={expFields}
            register={register}
            errors={errors}
            removeExp={removeExp}
            appendExp={appendExp}
          />
          <EducationSection
            eduFields={eduFields}
            register={register}
            errors={errors}
            removeEdu={removeEdu}
            appendEdu={appendEdu}
          />
        </div>

        <button
          type="submit"
          className={styles.updateBtn}
          disabled={isSubmitting || isProcessing}
        >
          {isSubmitting || isProcessing ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <hr className={styles.settingsDivider} />
      {/* Delete account button */}
      <DeleteAccountButton
        userEmail={user.email}
        isProcessing={isProcessing}
        onDelete={async () => {
          setIsProcessing(true);
          try {
            await deleteAccount();
            navigate("/");
          } catch {
            setUploadError("Failed to delete account.");
          } finally {
            setIsProcessing(false);
          }
        }}
      />
    </div>
  );
};

export default SeekerSettings;
