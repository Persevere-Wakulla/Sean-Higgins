export default function Layout({ children }) {
    return <>
        <div className="bg-cover bg-center bg-no-repeat bg-[url('/arizona.jpg')] h-screen">
            {children}
        </div>
    </>
}