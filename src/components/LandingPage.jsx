import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.navbarContainer}>
            <div className={styles.navbarLogo}>
              <img src="/logo.png" alt="Finhood" />
            </div>
            <div className={styles.navbarButtons}>
              <Link to="/login" className={styles.navbarButtonSecondary}>
                Log In
              </Link>
              <Link to="/signup" className={styles.navbarButtonPrimary}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroHeadline}>
              Stop Wondering Where Your
              <span className={styles.highlightText}> Money Went</span>
            </h1>
            <p className={styles.heroSubheading}>
              Finhood helps you track every rupee, cut down on unnecessary
              spending, and finally feel in control of your finances — without
              spreadsheets or stress.
            </p>
            <Link to="/signup" className={styles.ctaButton}>
              I'm Ready to Spend Smarter
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Choose Finhood</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💰</div>
              <h3 className={styles.featureTitle}>
                Understand Where Your Money Goes
              </h3>
              <p className={styles.featureDescription}>
                Track your spending habits and get insights into your financial
                patterns. No more wondering where your paycheck disappeared to.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3 className={styles.featureTitle}>
                Stay on Budget Without the Stress
              </h3>
              <p className={styles.featureDescription}>
                Set realistic budgets and get gentle reminders when you're close
                to your limits. Take control without feeling restricted.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3 className={styles.featureTitle}>
                See the Big Picture, Anytime
              </h3>
              <p className={styles.featureDescription}>
                Get a clear view of your finances with easy-to-read charts and
                summaries. Check your progress wherever you are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className={`${styles.sectionAlt} ${styles.aiToolsSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Powered by AI (Coming Soon...)
          </h2>
          <div className={styles.aiToolsGrid}>
            <div className={styles.aiToolCard}>
              <div className={styles.aiToolIcon}>🤖</div>
              <div className={styles.aiToolContent}>
                <h3 className={styles.aiToolTitle}>AI Assistant</h3>
                <p className={styles.aiToolDescription}>
                  Get personalized financial advice with our AI-powered
                  assistant that learns from your spending patterns.
                </p>
              </div>
            </div>
            <div className={styles.aiToolCard}>
              <div className={styles.aiToolIcon}>🎯</div>
              <div className={styles.aiToolContent}>
                <h3 className={styles.aiToolTitle}>Goal Planning</h3>
                <p className={styles.aiToolDescription}>
                  Set and achieve your financial goals with AI-driven
                  recommendations tailored to your lifestyle and income.
                </p>
              </div>
            </div>
            <div className={styles.aiToolCard}>
              <div className={styles.aiToolIcon}>📊</div>
              <div className={styles.aiToolContent}>
                <h3 className={styles.aiToolTitle}>Smart Analytics</h3>
                <p className={styles.aiToolDescription}>
                  Discover insights about your spending habits with advanced
                  analytics that highlight opportunities for savings.
                </p>
              </div>
            </div>
            <div className={styles.aiToolCard}>
              <div className={styles.aiToolIcon}>🔮</div>
              <div className={styles.aiToolContent}>
                <h3 className={styles.aiToolTitle}>Future Forecasting</h3>
                <p className={styles.aiToolDescription}>
                  Predict your financial future with AI-powered forecasting that
                  helps you plan for upcoming expenses and savings goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What Our Users Say</h2>
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialAvatar}>J</div>
              <div className={styles.testimonialContent}>
                <p className={styles.testimonialQuote}>
                  "Finhood has completely transformed how I manage my finances.
                  The AI insights are incredibly helpful and have saved me
                  hundreds each month!"
                </p>
                <div className={styles.testimonialAuthor}>
                  <span className={styles.testimonialName}>Jane Doe</span>
                  <span className={styles.testimonialRole}>
                    Financial Analyst
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialAvatar}>M</div>
              <div className={styles.testimonialContent}>
                <p className={styles.testimonialQuote}>
                  "The budgeting tools are so intuitive and the analytics
                  dashboard is beautiful. I can finally see where my money is
                  going without the stress."
                </p>
                <div className={styles.testimonialAuthor}>
                  <span className={styles.testimonialName}>Mike Smith</span>
                  <span className={styles.testimonialRole}>Entrepreneur</span>
                </div>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialAvatar}>S</div>
              <div className={styles.testimonialContent}>
                <p className={styles.testimonialQuote}>
                  "I've saved so much money since using Finhood's AI
                  recommendations. It's like having a financial advisor in my
                  pocket who knows exactly what I need."
                </p>
                <div className={styles.testimonialAuthor}>
                  <span className={styles.testimonialName}>Sarah Johnson</span>
                  <span className={styles.testimonialRole}>Investor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div>
              <div className={styles.footerLogo}>Finhood</div>
              <p className={styles.footerDescription}>
                Your personal finance assistant powered by AI. Take control of
                your finances today.
              </p>
            </div>
            <div>
              <h3 className={styles.footerTitle}>Quick Links</h3>
              <a href="#" className={styles.footerLink}>
                About Us
              </a>
              <a href="#" className={styles.footerLink}>
                Features
              </a>
              <a href="#" className={styles.footerLink}>
                Pricing
              </a>
              <a href="#" className={styles.footerLink}>
                Contact
              </a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            &copy; {new Date().getFullYear()} Finhood. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
