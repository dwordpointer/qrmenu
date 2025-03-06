import { createContext } from 'react';

interface InitialValue {
    name: string | undefined;
    setName: (state: string | undefined) => void;
    level: string | undefined;
    setLevel : (state: string | undefined) => void;
}

const initialValue: InitialValue = {
    name: undefined,
    setName: () => {},
    level: undefined,
    setLevel : ()=>{}
};

export const UserContext = createContext<InitialValue>(initialValue);
