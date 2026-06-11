import { createContext, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

const initialState = { items: [] } // items: [{ product, qty }]

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((i) => i.product.id === action.product.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id ? { ...i, qty: i.qty + 1 } : i,
          ),
        }
      }
      return { items: [...state.items, { product: action.product, qty: 1 }] }
    }
    case 'remove':
      return { items: state.items.filter((i) => i.product.id !== action.id) }
    case 'setQty': {
      if (action.qty <= 0) {
        return { items: state.items.filter((i) => i.product.id !== action.id) }
      }
      return {
        items: state.items.map((i) =>
          i.product.id === action.id ? { ...i, qty: action.qty } : i,
        ),
      }
    }
    case 'clear':
      return initialState
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = useMemo(() => {
    const count = state.items.reduce((sum, i) => sum + i.qty, 0)
    const subtotal = state.items.reduce((sum, i) => sum + i.product.price * i.qty, 0)
    return {
      items: state.items,
      count,
      subtotal,
      addItem: (product) => dispatch({ type: 'add', product }),
      removeItem: (id) => dispatch({ type: 'remove', id }),
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Co-locate the hook with its provider; the provider is rarely edited, so Fast
// Refresh is unaffected in practice.
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
