import { type GetServerSidePropsContext, type NextPage } from "next"
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { authOptions } from "~/server/auth";

const Login: NextPage = () => {

    return (
        <LoginComponent />
    )

};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(
        context.req, context.res, authOptions
    )

    if (session) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    return { props: {} }
}

const LoginComponent: React.FC = () => {
    return (
        <div>
            <div className="flex flex-col items-center justify-center gap-12 bg-gradient-to-r from-[#9FEDD7] to-[#026670] p-10 w-full h-screen">
                <h1 className="text-5xl text-white font-extrabold tracking-tight sm:text-[5rem]">
                    Todo <span className="text-[#FCE181]">Time</span> Tracker
                </h1>
                <button
                    className="rounded-full bg-[#FCE181] px-10 py-3 font-semibold text-white no-underline transition hover:bg-[#8E8D8A]/80"
                    onClick={() => void signIn()}
                >
                    Sign in
                </button>
            </div>
        </div>
    )
}

export default Login
