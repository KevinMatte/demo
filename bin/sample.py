import sys, io

# Changes:
# MyWorkSample():
    # - Added class to hold new bump state.
    # - Any start to end range (previously 1-100).
# - MyWorkSample.bump_state():
    # - Increment configurable (previously by 1)
    # - Replaced modulus (%) with more efficient tracking of remainders.
# - Assuming stream output, reducing memory allocations for previous string + strings.
# - run_tests(): Added tests.

class MyWorkSample:

    def __init__(self, start, end, arr, output, bump=1):
        assert start <= end, "End must come after start"
        assert end - start <= 1000, "Range must be <= than 1000"
        assert len(arr) < 100, "List of values must be < 100"

        self.arr_remainders = []
        self.start = start
        self.end = end
        self.bump = bump
        self.arr = arr
        self.output = output

    def bump_state(self) -> bool:
        # This replaces the expensive modulus calculation

        is_printed = False
        for i, arr_item in enumerate(self.arr):
            self.arr_remainders[i] -= self.bump

            # If hit 0 remainder, restart remainder
            if self.arr_remainders[i] <= 0:
                if self.arr_remainders[i] == 0:
                    is_printed = True
                self.arr_remainders[i] += arr_item[0]

        return is_printed

    def do_work_to_stream(self):
        # Since start can be any number, using the modulus calculation once here.
        self.arr_remainders = [
            num - ((self.start - self.bump) % num) for num, message in self.arr if num != 0
        ]

        for i in range(self.start, self.end + self.bump, self.bump):
            # self.output.write(f'{i}: ')
            is_printed = self.bump_state()
            if is_printed:
                for i, arr_item in enumerate(self.arr):
                    remainder = self.arr_remainders[i]
                    if remainder == arr_item[0]:
                        self.output.write(arr_item[1])
            else:
                self.output.write(f'{i}')

            self.output.write("\n")

def test(message, start, end, arr, expected_result):
    print(f"  Test: {message or expected_result}")

    # Going to 105, the first common multiple
    output = io.StringIO()
    try:
        sample = MyWorkSample(start, end, arr, output)
        sample.do_work_to_stream()
        result = output.getvalue()
    except Exception as e:
        result = str(e)
    finally:
        output.close()

    assert result == expected_result, f"Result mismatch. Expecting\n{expected_result}"

    return result

def run_tests():
    print("\nStarting tests...")
    test("FizzBizzBuzz from 3-5", 3, 5,
        [[3, "Fizz"], [5, "Bizz"], [7, "Buzz"]],
        "Fizz\n4\nBizz\n")

    test(None, 3, 5000, [[3, "Fizz"], [5, "Bizz"], [7, "Buzz"]], 'Range must be <= than 1000')
    test(None, 10, 3, [[3, "Fizz"], [5, "Bizz"], [7, "Buzz"]], "End must come after start")
    test(None, 3, 50, [[3, "Fizz"], [5, "Bizz"], [7, "Buzz"]] * 100, "List of values must be < 100")

    print("Tests passed")
    return True

def main():
    arr = [
        [3, "Fizz"],
        [5, "Bizz"],
        [7, "Buzz"],
    ]

    # Going to 105, the first common multiple
    sample = MyWorkSample(3, 105, arr, sys.stdout, 2)
    sample.do_work_to_stream()

    run_tests()

main()
