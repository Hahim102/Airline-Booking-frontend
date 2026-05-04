import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


export const ForbiddenPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-3 text-4xl">
          <span>🔒</span>
        </div>

        <h1 className="mb-3 text-3xl font-bold text-slate-900">403 - Access Forbidden</h1>
        <p className="mb-4 text-slate-600">
          You do not have permission to access this page. This restricted sector is reserved for
          flight command personnel with specific clearance levels.
        </p>

        <button className="mb-5 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700" onClick={() => navigate('/user')}>
          Return to Dashboard
        </button>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-600">
          <h3 className="mb-2 text-base font-semibold text-slate-800">Security Protocols</h3>
          <p className="mb-2">
            <strong>Credentials verification failed</strong> for the requested resource.
          </p>

          {user?.roles && user.roles.length > 0 && (
            <div className="mb-2">
              <p className="font-semibold"><strong>Your Current Roles:</strong></p>
              <ul className="list-disc pl-5">
                {user.roles.map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
            </div>
          )}

          <p>
            <strong>Need Assistance?</strong><br />
            Contact your Ops Supervisor for authorization keys.
          </p>
        </div>

        <div className="mt-4 text-sm text-slate-500">
          <p>
            <strong>Incident Log:</strong><br />
            Event ID: Sky-403-EX-992 has been recorded
          </p>
        </div>
      </div>
    </div>
  );
};
