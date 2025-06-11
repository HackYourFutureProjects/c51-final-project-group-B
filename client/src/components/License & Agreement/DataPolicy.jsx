import styles from "./dataPolicy.module.css";

const DataPolicy = () => {
  return (
    <div className={styles.dataPolicyContainer}>
      <h1 className={styles.mainTitle}>Privacy Policy</h1>
      <p className={styles.lastUpdated}>Effective Date: May 21, 2025</p>
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>Introduction</h2>
        <p className={styles.policyText}>
          At Talent Nest, we are committed to protecting your privacy and
          ensuring a safe online experience for all users. This Privacy Policy
          outlines how we collect, use, and protect your personal information
          when you visit our website, TalentNest.com, and use our services.
        </p>
        <p className={styles.policyText}>
          By accessing or using our website, you consent to the practices
          described in this policy. If you do not agree with the terms outlined
          in this Privacy Policy, please do not use our website or services.
        </p>
      </section>

      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
        <h3 className={styles.subSectionTitle}>Personal Information:</h3>
        <p className={styles.policyText}>
          When you register an account, submit job applications, or use other
          services on TalentNest, we collect personal information that may
          include:
        </p>
        <ul className={styles.policyList}>
          <li>Name</li>
          <li>Email address</li>
          <li>Address</li>
          <li>Resume and job-related information</li>
          <li>Employment history</li>
          <li>Educational background</li>
        </ul>

        <h3 className={styles.subSectionTitle}>Non-Personal Information:</h3>
        <p className={styles.policyText}>
          We also collect non-personal information automatically when you visit
          our website, including:
        </p>
        <ul className={styles.policyList}>
          <li>IP address</li>
          <li>Browser type</li>
          <li>Device information</li>
          <li>Usage data (pages visited, time spent on the site)</li>
        </ul>
        <p className={styles.policyText}>
          This information helps us improve your experience on the site and
          understand how our website is used.
        </p>
      </section>
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
        <p className={styles.policyText}>
          We use the information we collect to:
        </p>
        <ul className={styles.policyList}>
          <li>
            Provide and improve our services (such as job posting, recruitment,
            and CV search)
          </li>
          <li>Respond to inquiries and support requests</li>
          <li>Process applications and connect candidates with employers</li>
          <li>Communicate with you regarding job opportunities and updates</li>
          <li>Personalize your experience on Talent Nest</li>
          <li>Maintain the security and integrity of the website</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>
          3. How We Protect Your Information
        </h2>
        <p className={styles.policyText}>
          We take the security of your personal information seriously and employ
          industry-standard security measures to protect it. This includes using
          encryption, secure servers, and other safeguards to protect data from
          unauthorized access, alteration, or destruction.
        </p>
        <p className={styles.policyText}>
          However, please be aware that no data transmission over the internet
          is 100% secure, and we cannot guarantee the absolute security of your
          information.
        </p>
      </section>
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>4. Sharing Your Information</h2>
        <p className={styles.policyText}>
          We do not sell, rent, or trade your personal information to third
          parties. However, we may share your information in the following
          circumstances:
        </p>
        <ul className={styles.policyList}>
          <li>
            <strong>With Employers:</strong> If you submit an application or
            express interest in a job posting, we will share your information
            with the hiring company for recruitment purposes.
          </li>
          <li>
            <strong>With Service Providers:</strong> We may share your
            information with trusted third-party service providers who assist us
            in operating our website or conducting business, such as email
            service providers.
          </li>
          <li>
            <strong>For Legal Compliance:</strong> We may disclose your
            information to comply with applicable laws, regulations, or legal
            processes, or in response to a subpoena or court order.
          </li>
        </ul>
      </section>
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>
          5. Cookies and Tracking Technologies
        </h2>
        <p className={styles.policyText}>
          We use cookies and other tracking technologies to enhance your
          experience on our website. Cookies are small files stored on your
          device that help us remember your preferences and improve site
          performance.
        </p>
        <p className={styles.policyText}>
          You can control the use of cookies through your browser settings, but
          please note that disabling cookies may affect your ability to use some
          features of the website.
        </p>
      </section>
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>6. Your Data Rights</h2>
        <p className={styles.policyText}>
          You have the right to access, correct, or delete your personal
          information at any time. If you would like to update your information
          or request deletion, please contact us at{" "}
          <a href="mailto:talentnest7@gmail.com" className={styles.contactLink}>
            talentnest7@gmail.com
          </a>
          .
        </p>
        <p className={styles.policyText}>
          You may also opt out of marketing communications by following the
          unsubscribe instructions included in our emails.
        </p>
      </section>
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>7. Third-Party Links</h2>
        <p className={styles.policyText}>
          Our website may contain links to third-party websites. Please note
          that this Privacy Policy does not apply to third-party sites, and we
          are not responsible for the privacy practices or content of those
          sites.
        </p>
      </section>
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>8. Children’s Privacy</h2>
        <p className={styles.policyText}>
          Our services are not intended for individuals under the age of 15, and
          we do not knowingly collect personal information from children. If we
          become aware that we have collected information from a child under 15,
          we will take steps to delete it.
        </p>
      </section>
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>
          9. Changes to This Privacy Policy
        </h2>
        <p className={styles.policyText}>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated "Effective Date." We encourage
          you to review this policy periodically to stay informed about how we
          are protecting your information.
        </p>
      </section>
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>10. Contact Us</h2>
        <p className={styles.policyText}>
          If you have any questions or concerns about this Privacy Policy or our
          data practices, please contact us at:
        </p>
        <p className={styles.policyText}>
          TalentNest.com
          <br />
          Email:{" "}
          <a href="mailto:talentnest7@gmail.com" className={styles.contactLink}>
            talentnest7@gmail.com
          </a>
        </p>
        <p className={styles.policyText}>
          By using our website, you acknowledge and agree to the terms of this
          Privacy Policy.
        </p>
      </section>
    </div>
  );
};

export default DataPolicy;
