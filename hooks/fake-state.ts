function useFakeState<S>(initialValue: S): [() => S, (newValue: S) => void] {
  let value = initialValue;

  const setValue = (newValue: S) => {
    value = newValue;
    // console.log(`Value set to: ${value}`);
  };
  const getValue = () => value;

  return [getValue, setValue];
}

export default useFakeState;