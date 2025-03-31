import { Heading } from "../components/Heading";

export const Signin = () => {
    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label="Sign In" />
                    <div className="pt-2">
                        <input 
                            type="email" 
                            placeholder="Email" 
                            className="w-full px-2 py-1 border rounded border-slate-200"
                        />
                    </div>
                    <div className="pt-2">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="w-full px-2 py-1 border rounded border-slate-200"
                        />
                    </div>
                    <div className="pt-4">
                        <button className="w-full bg-gray-800 text-white py-2 rounded font-bold hover:bg-gray-900">
                            Sign In
                        </button>
                    </div>
                    <div className="pt-3 text-sm flex justify-center">
                      <a href="/signup" className="pl-1 underline">Sign Up</a>
                    </div>
                </div>
            </div>
        </div>
    )
}