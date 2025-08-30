"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserResponse } from 'weddingplanner-shared';

interface CurrentUserContextType {
    currentUser: UserResponse | null;
    setCurrentUser: (user: UserResponse | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export const useCurrentUser = () => {
    const context = useContext(CurrentUserContext);
    if (context === undefined) throw new Error('useCurrentUser must be used within an CurrentUserProvider');
    return context;
};

interface CurrentUserProviderProps {
    children: ReactNode;
}

export const CurrentUserProvider: React.FC<CurrentUserProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const value: CurrentUserContextType = {
        currentUser,
        setCurrentUser,
        isLoading,
        setIsLoading,
    };

    return (
        <CurrentUserContext.Provider value={value}>
            {children}
        </CurrentUserContext.Provider>
    );
};
