import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState("");
    const navigate = useNavigate();

    if (!id || !name) {
        return <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div className="text-2xl text-center">
                    <div className="text-red-500 mb-4">Invalid transfer details</div>
                    <div className="text-gray-600 text-base">
                        Please select a user from the dashboard to initiate transfer.
                    </div>
                    <button 
                        onClick={() => navigate("/dashboard")}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    }

    const transferMoney = async () => {
        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        try {
            const balanceResponse = await axios.get("http://localhost:8080/api/v1/account/balance", {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });

            const currentBalance = balanceResponse.data.balance;
            const transferAmount = Math.floor(Number(amount));

            if (transferAmount > currentBalance) {
                alert(`Insufficient balance. Your current balance is Rs. ${currentBalance.toFixed(2)}`);
                return;
            }

            const response = await axios.post("http://localhost:8080/api/v1/account/transfer", {
                to: id,
                amount: transferAmount
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.data.message === "Transfer successful") {
                alert("Transfer successful!");
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response?.status === 500) {
                alert("Server error. Please try again later.");
                console.error("Server error details:", error.response?.data);
            } else if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Transfer failed. Please try again.");
            }
            console.error("Transfer error:", error);
        }
    };

    return <div className="flex justify-center h-screen bg-gray-100">
        <div className="h-full flex flex-col justify-center">
            <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                <div className="flex flex-col space-y-1.5 p-6">
                    <h2 className="text-3xl font-bold text-center">Send Money</h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-2xl text-white">{name[0]?.toUpperCase()}</span>
                        </div>
                        <h3 className="text-2xl font-semibold">{name}</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label
                                className="text-sm font-medium leading-none"
                                htmlFor="amount"
                            >
                                Amount (in Rs)
                            </label>
                            <input
                                type="number"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                id="amount"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={transferMoney}
                            className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white hover:bg-green-600"
                        >
                            Initiate Transfer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}