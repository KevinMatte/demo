// C++ program to illustrate the thread synchronization using mutex
#include <iostream>
#include <thread>
#include <cassert>
#include <condition_variable>

using namespace std;

// import mutex from C++ standard library
#include <mutex>
#include <iomanip>

/**
 * Increases the number of thread switching by passing off to a different waiting thread, if any.
 */
class PoliteLock {
    // Key implementation part that supports notify_all() or notify_one().
    std::condition_variable m_cond;
    std::mutex m_cond_mutex;

    // Lock state
    bool m_is_locked = false;
    thread::id m_id;

    // Count of threads waiting for lock + 1 if is locked.
    int m_count = 0;

public:
    void lock() {
        std::unique_lock<std::mutex> lock(m_cond_mutex);

        // Ignore lock() if thread already has it.
        if (m_is_locked && m_id == this_thread::get_id())
            return;
        m_count++;

        // If someone else is waiting, let one of them get the lock.
        m_cond.wait(lock, [this]() {
            return !m_is_locked && (m_count == 1 || m_id != this_thread::get_id());
        });

        // Lock established.
        m_id = this_thread::get_id();
        m_is_locked = true;
    }

    void unlock() {
        std::unique_lock<std::mutex> lock(m_cond_mutex);

        // Ignore unlock() if thread doesn't own lock.
        if (!m_is_locked || m_id != this_thread::get_id())
            return;

        // Unlock complete
        m_count--;
        m_is_locked = false;

        // Notify any other thread.
        m_cond.notify_one();
    }
};

/**
 * Free up processing after a countdown to other threads when repeatedly needing locks.
 *
 * The PoliteLock enhances this by assuring a different thread will pick up the lock if it's waiting.
 *
 * @tparam T A mutex, PoliteLock or anything with a lock()/unlock() method.
 */
template <typename T>
class LockCountdown {
    int m_maxCount = 0;
    int m_count = 0;
    bool m_is_locked = false;

    T &m_shared_lock;


public:
    LockCountdown(T& sl, int n) : m_shared_lock(sl), m_maxCount(n) {
        assert(m_maxCount > 0);
    };

    /**
     * Start a lock, and if it already has one, unlock and lock it again
     * when the countdown completes to free up processing for other threads.
     */
    void relock() {

        if (!m_is_locked) {
            m_count = 1;

            m_shared_lock.lock();
            m_is_locked = true;
        } else {
            m_count++;
            if (m_count >= m_maxCount) {
                unlock();
                relock();
            }
        }
    }

    void unlock() {
        if (m_is_locked) {
            m_shared_lock.unlock();
            m_is_locked = false;
        }
    }

    ~LockCountdown() {
        unlock();
    }
};

// ========================================================================
// Testing
// ------------------------------------------------------------------------
// Shared resource for testing.
int number = 0;
int switched_count = 0;
thread::id id;

// function to increment the number
template <typename T>
void increment(T& sharedLock, bool useCountdown){
    LockCountdown countDown(sharedLock, 13);

    // increment number by 1 for 1000000 times
    for(int i=0; i<1000; i++){
        // Lock the thread using lock
        if (useCountdown)
            countDown.relock();
        else
            sharedLock.lock();
        if (this_thread::get_id() != id) {
            switched_count++;
            id = this_thread::get_id();
        }
        // Do some meaningless work.
        for (long k = 0; k<1000l; k++)
            ;
        number++;
        if (!useCountdown)
            sharedLock.unlock();
    }
}

template <typename T>
void test(const char *name, bool useCountdown, int n=2) {
    cout << setw(20) << right << name << (useCountdown ? " with countdown" : " without countdown") << ": " << n << " threads.";

    switched_count = 0;
    number = 0;

    T sharedLock;

    thread *threads = new thread[n];
    for (int i=0; i<n; i++) {
        threads[i] = thread(increment<T>, ref(sharedLock), useCountdown);
    }

    // Start both threads simultaneously
    for (int i=0; i<n; i++) {
        threads[i].join();
    }
    assert(number == n * 1000);

    // Print the number after the execution of both threads
    cout << " Switched threads: " << switched_count << endl;
}

int main()
{
    test<PoliteLock>("PoliteLock Test", true, 200);
    test<mutex>("mutex Test", true, 200);
    test<PoliteLock>("PoliteLock Test", false, 200);
    test<mutex>("mutex Test", false, 200);

    return 0;
}