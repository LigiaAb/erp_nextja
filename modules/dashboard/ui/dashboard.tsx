import { AppSidebar } from "./sidebar";

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 min-h-0 flex">
        <AppSidebar />

        {/* Navbar */}
        {/* <main className="flex-1 flex flex-col">
          <div className="h-14 shrink-0">
            <AppNavbar />
          </div> */}

        {/* Contenido */}
        {/* <div className="flex-1 min-h-0 overflow-auto ">{children}</div> */}
        {/* </main> */}
      </div>
    </div>
  );
};

export default Dashboard;
