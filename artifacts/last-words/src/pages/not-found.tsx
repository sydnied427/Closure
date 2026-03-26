import React from "react";
import { Link } from "wouter";
import { NoiseBackground } from "@/components/NoiseBackground";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative">
      <NoiseBackground />
      <div className="text-center px-6 max-w-md relative z-10">
        <h1 className="text-6xl font-serif font-bold text-foreground mb-4">404</h1>
        <p className="text-xl font-serif text-muted-foreground mb-8">
          The page you are looking for has been moved or no longer exists.
        </p>
        <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return Home
        </Link>
      </div>
    </div>
  );
}
