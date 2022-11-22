import { shallowEqual } from "./shallowEqual";
import { useRefPrevious } from "./useRefPrevious";

export function useMemoShallowEqual<T>(value: T) {
	const ref = useRefPrevious(value);
	if (shallowEqual(ref.current, value)) return ref.current;
	else return value;
}
