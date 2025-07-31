import PasswordUpdate from "../components/PasswordUpdate"
import ProfileSettinfForm from "../components/ProfileSettinfForm"



function Settings() {
  return (
    <div className="container  mx-auto p-2 text-white flex flex-col gap-5">
        <p className="text-3xl">Settings</p>
        <ProfileSettinfForm />
        <PasswordUpdate />
    </div>
  )
}

export default Settings



