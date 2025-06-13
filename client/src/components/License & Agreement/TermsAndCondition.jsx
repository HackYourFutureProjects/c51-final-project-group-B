import styles from "./dataPolicy.module.css";

const TermsAndConditions = () => {
  return (
    <main className={styles.content}>
      <h2>Terms and Conditions of Service (Revised: Jun. 6/2025)</h2>
      <section>
        <p>Welcome to TalentNest.com</p>
        <p>
          These Terms and Conditions (&quot;Terms&quot;) govern your access to
          and use of the website TalentNest.com (&quot;Website&quot;) and the
          services provided by TalentNest (&quot;Services&quot;). By accessing
          or using the Website and Services, you agree to be bound by these
          Terms. If you do not agree to these Terms, please do not use the
          Website.
        </p>
      </section>

      {/* Terms sections */}
      <section>
        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing the Website and using our Services, you confirm that you
          have read, understood, and agree to be bound by these Terms and
          Conditions. These Terms govern your relationship with TalentNest.com
          and its users, including employers, job seekers, and others accessing
          the Website.
        </p>
      </section>

      <section>
        <h3>2. Changes to Terms</h3>
        <p>
          We reserve the right to update or modify these Terms at any time. Any
          changes will be effective immediately upon posting the revised Terms
          on this page. It is your responsibility to review these Terms
          periodically for updates. Your continued use of the Website after such
          changes constitutes your acceptance of the new Terms.
        </p>
      </section>

      <section>
        <h3>3. Services Provided</h3>
        <p>TalentNest.com offers the following services:</p>
        <h3>Employer Tasks</h3>
        <ul>
          <li>Register company account (with option for Google signup)</li>
          <li>Post job listings (with full details and validation)</li>
          <li>Manage job listings (edit, unpublish, delete, view status)</li>
          <li>Search CVs and freelancers</li>
          <li>Use shortlisting and recruitment services</li>
          <li>Access HR consultation, payroll, and outsourcing services</li>
        </ul>

        <h3>Job Seeker Tasks</h3>
        <ul>
          <li>
            Register job seeker account (with terms agreement and validation)
          </li>
          <li>
            Create and manage profile (update info, upload resume, preview)
          </li>
          <li>
            Search and apply for jobs (view details, apply on platform or
            external)
          </li>
          <li>Receive job notifications based on profile</li>
        </ul>
        <p>
          These Services are designed to streamline the hiring process, improve
          workforce management, and connect job seekers with employers.
        </p>
      </section>

      <section className={styles.contactSection}>
        <h3>Contact Us</h3>
        <address>
          TalentNest.com
          <br />
          Amsterdam, Netherlands
          <br />
          Email:{" "}
          <a href="mailto:talentnest7@gmail.com">talentnest7@gmail.com</a>
        </address>
      </section>

      <footer className={styles.footer}>
        <p>© 2025 TalentNest. All Rights Reserved</p>
      </footer>
    </main>
  );
};

export default TermsAndConditions;
