
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-lg px-4">
        <h1 className="text-4xl font-bold mb-6 text-medical-800">Doctor Finder</h1>
        <p className="text-xl text-gray-600 mb-8">
          Find the right healthcare provider based on your needs with our advanced search and filtering tools.
        </p>
        <Link 
          to="/doctors" 
          className="inline-block bg-medical-600 hover:bg-medical-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
        >
          Find Doctors
        </Link>
      </div>
    </div>
  );
};

export default Index;
