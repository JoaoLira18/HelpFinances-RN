import { renderHook, act } from '@testing-library/react-hooks'
import { AuthProvider, useAuth } from './auth'
import { mocked } from 'ts-jest/utils'
import { logInAsync } from 'expo-google-app-auth'

jest.mock('expo-auth-session')

describe('Auth Hook', () => {
    test('should be able to sign with Google account', async () => {

        const googleMocked = mocked(logInAsync as any)
        googleMocked.mockReturnValueOnce({
            type: 'success',
            user: {
                id: 'any_id',
                email: 'joaolira281@gmail.com',
                name: 'Lira',
                photo: 'any_photo.png'
            }
        })

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        })

        await act(() => result.current.signInWithGoogle())

        expect(result.current.user.email).toBe('joaolira281@gmail.com')

    })

    test('user should not connect if cancel authentication with Google', async () => {

        const googleMocked = mocked(logInAsync as any)
        googleMocked.mockReturnValueOnce({
            type: 'cancel'
        })

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        })

        await act(() => result.current.signInWithGoogle())

        expect(result.current.user).not.toHaveProperty('id')

    })
})