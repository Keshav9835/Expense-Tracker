import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React, { Suspense } from "react";
import AccountCard from "./_components/account-card";
import { getCurrentBudget } from "@/actions/budget";
import BudgetProgress from "./_components/budget-progress";
import DashboardOverview from "./_components/transaction-overview";

async function DashboardPage() {
  const accounts = await getUserAccounts();
  const defaultAccount = accounts?.find((account) => account.isDefault);

  // Only fetch budget and transaction data if we have a default account
  let budgetData = null;
  let transactions = [];

  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
    transactions = await getDashboardData(defaultAccount.id);
  }

  // If no accounts exist, show a welcome message with account creation
  if (!accounts || accounts.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Your Dashboard!</h2>
          <p className="text-muted-foreground mb-8">
            Get started by creating your first account to track your finances.
          </p>
          
          <div className="flex justify-center">
            <CreateAccountDrawer isFirstAccount={true}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed w-64">
                <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-32 pt-5 pb-5">
                  <Plus className="h-10 w-10 mb-2" />
                  <p className="text-sm font-medium">Create Your First Account</p>
                </CardContent>
              </Card>
            </CreateAccountDrawer>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Budget Progress - Only show if we have a default account */}
      {defaultAccount && (
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      {/* Overview */}
      <Suspense fallback={"Loading Overview..."}>
        <DashboardOverview
          accounts={accounts}
          transactions={transactions || []}
        />
      </Suspense>

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer isFirstAccount={false}>
          <Card
            className={
              "hover:shadow-md transition-shadow cursor-pointer border-dashed"
            }
          >
            <CardContent
              className={
                "flex flex-col items-center justify-center text-muted-foreground h-full pt-5 pb-5"
              }
            >
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium ">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {accounts.length > 0 &&
          accounts?.map((account) => {
            return <AccountCard key={account.id} account={account} />;
          })}
      </div>
    </div>
  );
}

export default DashboardPage;