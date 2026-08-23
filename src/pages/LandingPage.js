import React from 'react';

const LandingPage = () => {
    return (
        <div id="signature-project-root" style={{ display: 'block' }}>
            <nav className="sp-navbar">
                <div className="sp-nav-logo">BrainJoy</div>
                <ul className="sp-nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="#ideas">Ideas</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <button className="sp-nav-cta">Collaborate</button>
            </nav>

            <main>
                {/* HOME SECTION */}
                <section id="home" className="sp-hero" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url('assets/stem_innovation_hero.png')", backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
                    <div className="sp-hero-content">
                        <span className="sp-badge">Signature Project</span>
                        <h1>Build BrainJoy as Your Signature Project</h1>
                        <p>A platform for modern STEM education and innovation. Shaping the future of science through curiosity and excellence.</p>
                        <div className="sp-hero-actions">
                            <a href="#projects" className="sp-btn-primary">View Projects</a>
                            <a href="#about" className="sp-btn-secondary">Our Story</a>
                        </div>
                    </div>

                </section>

                {/* MISSION & VISION */}
                <section className="sp-mission">
                    <div className="sp-container">
                        <div className="sp-mission-grid">
                            <div className="sp-mission-card">
                                <h3>Your Mission</h3>
                                <p>To empower the next generation of innovators with the tools and mindsets needed to tackle global challenges through STEM.</p>
                            </div>
                            <div className="sp-mission-card">
                                <h3>Vision for Future STEM</h3>
                                <p>A world where every student has access to high-quality, engaging, and innovative science education that inspires sustainable action.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ABOUT SECTION */}
                <section id="about" className="sp-about">
                    <div className="sp-container">
                        <div className="sp-about-content">
                            <h2>Your Story</h2>
                            <p>Science education needs a change. From classroom excellence to sustainability leadership, we are redefining how STEM is taught and experienced.</p>
                            <ul className="sp-about-features">
                                <li>Modernizing STEM Curriculums</li>
                                <li>Fostering Innovation Mindsets</li>
                                <li>Leading Sustainability Initiatives</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* PROJECTS SECTION */}
                <section id="projects" className="sp-projects">
                    <div className="sp-container">
                        <h2 className="sp-section-title">Featured Projects</h2>
                        <div className="sp-project-grid">
                            <div className="sp-project-card">
                                <div className="sp-project-img" style={{ backgroundImage: "url('assets/classroom-image.jpg')", backgroundSize: 'cover' }}></div>
                                <h3>STEM Learning Programs</h3>
                                <p>Interactive programs designed to make complex science concepts accessible and fun.</p>
                            </div>
                            <div className="sp-project-card">
                                <div className="sp-project-img" style={{ backgroundImage: "url('assets/science_innovation.png')", backgroundSize: 'cover' }}></div>
                                <h3>Science Innovation</h3>
                                <p>Cutting-edge projects bridging theory and real-world application.</p>
                            </div>
                            <div className="sp-project-card">
                                <div className="sp-project-img" style={{ backgroundImage: "url('assets/sustainability_leadership.png')", backgroundSize: 'cover' }}></div>
                                <h3>Sustainability Education</h3>
                                <p>Empowering students to lead environmental change through evidence-based learning.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* IDEAS SECTION */}
                <section id="ideas" className="sp-ideas">
                    <div className="sp-container">
                        <h2 className="sp-section-title">Innovation Ideas</h2>
                        <div className="sp-ideas-list">
                            <article className="sp-idea-item">
                                <span className="sp-idea-date">March 2026</span>
                                <h3>AI in Education: A New Frontier</h3>
                                <p>Exploring how artificial intelligence can personalize STEM learning for every student.</p>
                                <a href="#" className="sp-read-more">Read More &rarr;</a>
                            </article>
                            <article className="sp-idea-item">
                                <span className="sp-idea-date">February 2026</span>
                                <h3>The Future of STEM Education</h3>
                                <p>Why multi-disciplinary approaches are essential for the next decade of innovation.</p>
                                <a href="#" className="sp-read-more">Read More &rarr;</a>
                            </article>
                        </div>
                    </div>
                </section>

                {/* CONTACT SECTION */}
                <section id="contact" className="sp-contact">
                    <div className="sp-container">
                        <div className="sp-contact-card">
                            <h2>Let's Collaborate</h2>
                            <p>Open for speaking invitations, consulting, and innovative STEM collaborations.</p>
                            <form className="sp-contact-form" onSubmit={(e) => e.preventDefault()}>
                                <input type="text" placeholder="Name" required />
                                <input type="email" placeholder="Email" required />
                                <textarea placeholder="Your Message" rows="4" required></textarea>
                                <button type="submit" className="sp-btn-submit">Send Message</button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="sp-footer">
                <p>&copy; 2026 BrainJoy. Built with vision.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
