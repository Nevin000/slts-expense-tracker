const Transactions = () => {
    return (
        <div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Transactions
                </h1>

                <p className="mt-2 text-slate-500">
                    View your recent financial transactions.
                </p>
            </div>


            <div className="rounded-2xl bg-white p-8 shadow-sm">

                <h2 className="text-xl font-semibold text-slate-900">
                    Recent Transactions
                </h2>

                <p className="mt-2 text-slate-500">
                    Your transactions will appear here.
                </p>

            </div>

        </div>
    );
};

export default Transactions;