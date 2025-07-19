type Button = {
    text: string;
    onclick?: () => void | Promise<void>;
}

function DashboardButton({ text, onclick }: Button) {
    return (
        <button 
            className="text-white bg-[#9C27B0] rounded px-2 py-1 cursor-pointer" 
            onClick={() => onclick?.()} 
        >
            {text}
        </button>
    );
}

export default DashboardButton;