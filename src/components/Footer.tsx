import React from 'react';
import { Github, Linkedin, Mail, Globe } from 'lucide-react';

interface FooterProps {
  github?: string;
  linkedin?: string;
  email?: string;
  website?: string;
}

export function Footer({ github, linkedin, email, website }: FooterProps) {
  return (
    <footer className="relative z-10 backdrop-blur-xl bg-white/5 border-t border-white/10 py-6 mt-12">
      <div className="max-w-4xl mx-auto px-8">
        <div className="flex justify-center space-x-6">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 hover:text-indigo-100 transition-colors duration-200 group"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 hover:text-indigo-100 transition-colors duration-200 group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="text-indigo-300 hover:text-indigo-100 transition-colors duration-200 group"
              aria-label="Email"
            >
              <Mail className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            </a>
          )}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 hover:text-indigo-100 transition-colors duration-200 group"
              aria-label="Website"
            >
              <Globe className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            </a>
          )}
        </div>
        <p className="text-center text-indigo-300/50 text-sm mt-4">
          Built with ❤️ | {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}