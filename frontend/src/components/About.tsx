import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">About Me</h2>
          <div className="w-20 h-1 bg-teal-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                I am a Computer & Software Engineering student with a passion for building innovative solutions
                using modern technologies. My journey in tech began when I built my first website at the age of 22,
                and I've been hooked ever since.
              </p>
              
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Currently, I'm focused on developing my skills in <span className="text-teal-600 dark:text-teal-500 font-medium">web development</span>,
                <span className="text-teal-600 dark:text-teal-500 font-medium"> cloud-native infrastructure</span>, and
                <span className="text-teal-600 dark:text-teal-500 font-medium"> Kubernetes</span>. I'm also exploring
                the exciting world of <span className="text-teal-600 dark:text-teal-500 font-medium">blockchain technology</span> and its applications.
              </p>
              
              <p className="text-slate-700 dark:text-slate-300">
                When I'm not coding, you can find me hiking in the mountains, reading tech blogs, or
                contributing to open-source projects. I believe in continuous learning and am always
                looking for new challenges to expand my knowledge and skills.
              </p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Problem Solver</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Tech Enthusiast</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Fast Learner</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Detail Oriented</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Team Player</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Creative Thinker</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium"> Continuous Learner</span>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                <img 
                  src="/photo@@-1.jpg" 
                  alt="About me"
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;