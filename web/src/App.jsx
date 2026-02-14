import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import React from "react";
import "./App.css";

export default function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello, World!</h1>
      <SignedOut>
        <SignInButton mode="modal"/>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
