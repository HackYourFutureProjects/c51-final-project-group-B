import { Routes, Route } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import BaseProfileLayout from "../../components/UserPersonalProfile/BaseProfileLayout/BaseProfileLayout";

//  Seeker-specific components
import SeekerOverview from "../../components/UserPersonalProfile/Seeker/Overview";
import SeekerJobs from "../../components/UserPersonalProfile/Seeker/Jobs";
import SeekerSettings from "../../components/UserPersonalProfile/Seeker/Settings";

//  Company-specific components
import CompanyOverview from "../../components/UserPersonalProfile/Company/Overview";
import CompanyJobs from "../../components/UserPersonalProfile/Company/Jobs";
import CompanySettings from "../../components/UserPersonalProfile/Company/Settings";

//   shared
import Messages from "../../components/UserPersonalProfile/Shared/Messages";

import Loading from "../../components/templates/Loader";

const ProfilePage = () => {
  const { user, loading } = useUser();
  if (loading) return <Loading />;
  if (!user) return <div>No user found.</div>; //  handle no user case we will add a redirect later

  return (
    <BaseProfileLayout>
      <Routes>
        {/*  route for messages */}
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:conversationId" element={<Messages />} />
        {/*  Conditional routes based on user type */}
        {user.userType === "seeker" ? (
          <>
            <Route path="seeker-overview" element={<SeekerOverview />} />
            <Route path="seeker-jobs" element={<SeekerJobs />} />
            <Route path="seeker-settings" element={<SeekerSettings />} />
            {/* Default  */}
            <Route index element={<SeekerOverview />} />
          </>
        ) : (
          <>
            <Route path="company-overview" element={<CompanyOverview />} />
            <Route path="company-jobs" element={<CompanyJobs />} />
            <Route path="company-settings" element={<CompanySettings />} />
            {/* Default  */}
            <Route index element={<CompanyOverview />} />
          </>
        )}
      </Routes>
    </BaseProfileLayout>
  );
};

export default ProfilePage;
