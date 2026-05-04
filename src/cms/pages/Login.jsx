import { DashboardPreview } from "../components/loginComp/DashboardPreview";
import  LoginForm  from "../components/loginComp/LoginForm"

export default function SaasLogin() {
  return (
    <div className="min-h-screen w-full flex bg-[#ffffff] font-sans text-gray-900 overflow-hidden selection:bg-[#23b5b5]/30">
      <LoginForm />
      <DashboardPreview />
    </div>
  );
}