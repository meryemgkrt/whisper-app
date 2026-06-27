import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { ArrowRightIcon, Sparkles } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen lg:h-screen bg-[#1a1a1a] text-base flex flex-col lg:flex-row">
      {/* left side */}
      <div className="flex flex-1 flex-col p-5 sm:p-8 lg:p-12 relative overflow-y-auto lg:overflow-hidden">
        {/* navbar */}
        <nav className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="size-8 sm:size-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-gray-500/20">
              <Sparkles className="size-4 sm:size-5 text-primary-content" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-primary-content">
              Whisper
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <SignUpButton mode="modal">
              <button className="btn btn-sm sm:btn-md gap-1.5 sm:gap-2 bg-linear-to-r from-amber-500 to-orange-500 text-xs sm:text-sm font-semibold rounded-full hover:opacity-90 shadow-lg shadow-orange-500/25 border-none px-3 sm:px-4">
                Get Started
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="btn btn-sm sm:btn-md gap-1.5 sm:gap-2 bg-linear-to-r from-amber-500 to-orange-500 text-xs sm:text-sm font-semibold rounded-full hover:opacity-90 shadow-lg shadow-orange-500/25 border-none px-3 sm:px-4">
                Sign in
              </button>
            </SignInButton>
          </div>
        </nav>

        {/* main content */}
        <div className="flex-1 flex flex-col justify-center max-w-xl relative z-10 py-8 lg:py-0">
          {/* tag */}
          <div className="mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Now Available in <span className="text-amber-500">Beta</span>
            </span>
          </div>

          {/* Header */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight font-mono">
            Messaging for <br />
            <span className="bg-linear-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              Everyone
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-base-content/70 leading-relaxed max-w-md">
            Secure, private, and lightning-fast messaging platform that keeps
            your conversations safe and your data protected.
          </p>

          {/* CTA BTNS */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <SignUpButton mode="modal">
              <button className="group flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-base-100 text-base-content text-sm sm:text-base font-semibold rounded-2xl hover:bg-base-200 transition-colors duration-200">
                Start Messaging
                <ArrowRightIcon className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="group flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-base-100 text-base-content text-sm sm:text-base font-semibold rounded-2xl hover:bg-base-200 transition-colors duration-200">
                I have an account
                <ArrowRightIcon className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </SignInButton>
          </div>

          {/* Avatars */}
          <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="avatar-group -space-x-3">
              <div className="avatar">
                <div className="w-8 sm:w-10 rounded-full border-2 border-base-100">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User avatar" />
                </div>
              </div>
              <div className="avatar">
                <div className="w-8 sm:w-10 rounded-full border-2 border-base-100">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User avatar" />
                </div>
              </div>
              <div className="avatar">
                <div className="w-8 sm:w-10 rounded-full border-2 border-base-100">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" alt="User avatar" />
                </div>
              </div>
              <div className="avatar">
                <div className="w-8 sm:w-10 rounded-full border-2 border-base-100">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" alt="User avatar" />
                </div>
              </div>
              <div className="avatar avatar-placeholder">
                <div className="w-8 sm:w-10 rounded-full border-2 border-base-100 bg-base-300 text-base-content">
                  <span className="text-xs font-mono">+5k</span>
                </div>
              </div>
            </div>
            <span className="text-xs sm:text-sm text-base-content/70">
              Join <span className="font-mono text-base-content/80">10,000+</span> happy users
            </span>
          </div>

          {/* Stats */}
          <div className="mt-10 sm:mt-12 flex flex-wrap items-center gap-5 sm:gap-8 lg:gap-10">
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono">10K+</div>
              <div className="text-xs text-base-content/60 mt-1 uppercase tracking-wider">Users</div>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono">99.9%</div>
              <div className="text-xs text-base-content/60 mt-1 uppercase tracking-wider">Uptime</div>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono">&lt;50ms</div>
              <div className="text-xs text-base-content/60 mt-1 uppercase tracking-wider">Latency</div>
            </div>
          </div>
        </div>
      </div>

      {/* right side */}
      <div className="hidden lg:flex flex-1 relative bg-base-200 items-center justify-center overflow-hidden">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-linear-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-[100px]" />

        {/* Image Container */}
        <div className="relative z-10">
          <div className="absolute -inset-px rounded-3xl bg-linear-to-b from-white/20 to-white/5 p-px">
            <div className="w-full h-full rounded-3xl bg-base-200" />
          </div>

          <div className="relative p-6 rounded-3xl border border-base-300 bg-base-200/80 backdrop-blur-xl shadow-2xl">
            <img src="/auth.png" alt="Chat illustration" className="w-72 xl:w-96 rounded-2xl" />

            <div className="absolute -top-4 -right-4 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium backdrop-blur-sm">
              ● 3 online
            </div>

            <div className="absolute -bottom-4 -left-4 px-4 py-2.5 bg-base-300/40 border border-base-300 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-linear-to-br from-amber-400 to-orange-500" />
                  <div className="w-6 h-6 rounded-full bg-linear-to-br from-rose-400 to-pink-500" />
                </div>
                <span className="text-sm text-base-content/80">typing...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;