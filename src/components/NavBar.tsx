'use client';

// import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
// import concessionaireLogo from '@/public/concesionario-de-coches.png';

const Navbar = () => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div className="text-center p-4">Cargando...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error.message}</div>;

  return (
    <nav className="bg-violet-300 shadow-md">
      <ul className="flex justify-between items-center my-4 px-4">
        <li>
          <button onClick={() => router.push('/')} className="hover:scale-110">
            {/* <Image
              src={concessionaireLogo}
              alt="Logo Concesionario"
              width={56}
              height={56}
              className="ml-2 hover:cursor-pointer hover:scale-125"
            /> */}
          </button>
        </li>
        <li className="text-lg font-medium hover:scale-110 hover:text-indigo-700 cursor-pointer">Mazda</li>
        <li className="text-lg font-medium hover:scale-110 hover:text-indigo-700 cursor-pointer">Renault</li>
        <li className="text-lg font-medium hover:scale-110 hover:text-indigo-700 cursor-pointer">Toyota</li>
        <li className="text-lg font-medium hover:scale-110 hover:text-indigo-700 cursor-pointer">Honda</li>
        <li className="p-2">
          {!user ? (
            <button
              onClick={() => router.push('/api/auth/login?returnTo=/admin')}
              className="m-1 bg-indigo-500 p-2 border border-sky-900 text-white rounded-lg shadow-md hover:scale-110 hover:bg-indigo-900"
            >
              {/* <a href="/api/auth/login">Login</a> */}
              Login
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-indigo-700 font-medium">Hola, {user.name}</span>
              <button
                onClick={() => router.push('/api/auth/logout')}
                className="bg-red-500 p-2 border border-red-900 text-white rounded-lg shadow-md hover:scale-110 hover:bg-red-700"
              >
                {/* <a href="/api/auth/logout">Logout</a> */}
                Logout
              </button>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
