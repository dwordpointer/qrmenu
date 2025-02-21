import { createContext } from 'react';

interface InitialValue {
    image: string | undefined;
    setImage: (state: string | undefined) => void;
}

const initialValue: InitialValue = {
    image: undefined,
    setImage: () => {},
};

export const ImageContext = createContext<InitialValue>(initialValue);
