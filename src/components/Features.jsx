import React from 'react';

const Features = () => {
  return (
    <section className="features-section">
      <h2 className="features-title">Why Choose Finhood</h2>
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3 className="feature-title">Understand Where Your Money Goes</h3>
          <p className="feature-description">
            Track your spending habits and get insights into your financial
            patterns. No more wondering where your paycheck disappeared to.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3 className="feature-title">Stay on Budget Without the Stress</h3>
          <p className="feature-description">
            Set realistic budgets and get gentle reminders when you're close to
            your limits. Take control without feeling restricted.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3 className="feature-title">See the Big Picture, Anytime</h3>
          <p className="feature-description">
            Get a clear view of your finances with easy-to-read charts and
            summaries. Check your progress wherever you are.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
