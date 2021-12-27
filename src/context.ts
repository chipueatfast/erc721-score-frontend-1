import React from "react";

export const BlockchainLoadingContext = React.createContext<{
    isBlockchainLoading: boolean;
    setIsBlockchainLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>(null);