import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState
} from "react";

const { client_id } = process.env
const { redirect_uri } = process.env

import * as AuthSession from 'expo-auth-session'
import * as AppleAuthentication from 'expo-apple-authentication'

import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface AuthContextData {
    user: User;
    signInWithGoogle(): Promise<void>;
    // signInWithApple(): Promise<void>;
    signOut(): Promise<void>;
    userStorageLoading: boolean;
}

interface AuthorizationResponse {
    params: {
        access_token: string;
    },
    type: string;
}

const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps){
    const [user, setUSer] = useState<User>({} as User)
    const [userStorageLoading, setUserStorageLoading] = useState(true)

    const userStorageKey = '@gofinances:user'

    async function signInWithGoogle() {
        try {
            const response_type = 'token';
            const scope = encodeURI('profile email');

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;

            const { type, params} = await AuthSession
            .startAsync({ authUrl }) as AuthorizationResponse

            if (type === "success") {
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)

                const userInfo = await response.json();

                const userLogged = {
                    id: String(userInfo.id),
                    name: userInfo.given_name,
                    email: userInfo.email,
                    photo: userInfo.picture
                }
                
                setUSer(userLogged)
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
            }

        } catch (error: any) {
            throw new Error(error);
        }
    }

    // async function signInWithApple(){
    //     try {
    //         const credential = await AppleAuthentication.signInAsync({
    //             requestedScopes: [
    //                 AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    //                 AppleAuthentication.AppleAuthenticationScope.EMAIL,
    //             ]
    //         })

    //         if(credential) {
    //             const name = credential.fullName!.givenName!
    //             const photo = `http://ui-avatars.com/api/?name=${name}&length=1`
    //             const userLogged = {
    //                 id: String(credential.user),
    //                 email: credential.email!,
    //                 name,
    //                 photo,
    //             }

    //             console.log(userLogged)

    //             setUSer(userLogged)
    //             await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
    //         }


    //     } catch (error: any) {
    //         throw new Error(error)
    //     }
    // }

    async function signOut() {
        setUSer({} as User)
        await AsyncStorage.removeItem(userStorageKey)
    }

    useEffect(() => {
        async function loadUseStorageData() {
            const userStorage = await AsyncStorage.getItem(userStorageKey)

            if(userStorage){
                const userLogged = JSON.parse(userStorage) as User;
                setUSer(userLogged)
            }
            setUserStorageLoading(false)
        }

        loadUseStorageData()
    },[])

    return (
        <AuthContext.Provider value={{
            user,
            signInWithGoogle,
            // signInWithApple,
            signOut,
            userStorageLoading,
        }}>
            { children }
        </AuthContext.Provider>
    )
}

function useAuth(){
    const context = useContext(AuthContext)

    return context;
}

export { AuthProvider, useAuth }