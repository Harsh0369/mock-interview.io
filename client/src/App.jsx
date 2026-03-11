import React from 'react'
import {SignInButton,SignedOut,SignedIn,SignOutButton,UserButton} from "@clerk/clerk-react"

const App = () => {
  return (
    <div>App

      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
        <SignOutButton />
      </SignedIn>
    </div>
  )
}

export default App