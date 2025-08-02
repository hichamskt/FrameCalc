import CompanySettingsForm from "../components/CompanySettingsForm"


function CompanySettings() {
  return (
     <div className="container  mx-auto p-2 text-white flex flex-col gap-5">
        <p className="text-3xl">Company Settings</p>
        <CompanySettingsForm />
    </div>
  )
}

export default CompanySettings




