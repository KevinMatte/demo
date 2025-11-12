// C++ program to illustrate the thread synchronization using mutex
#include <iostream>
#include <thread>
#include <cassert>
#include <condition_variable>

using namespace std;

// import mutex from C++ standard library
#include <mutex>

class PoliteLock {
    std::condition_variable m_cond;
    std::mutex m_cond_mutex;
    bool m_is_locked = false;
    thread::id m_id;
    int m_count = 0;
//    std::mutex m_count_mutex;

public:
    void lock() {
        std::unique_lock<std::mutex> lock(m_cond_mutex);
        if (m_is_locked && m_id == this_thread::get_id())
            return;
//        m_count_mutex.lock();
        m_count++;
//        m_count_mutex.unlock();

        m_cond.wait(lock, [this]() {
            return !m_is_locked && (m_count == 1 || m_id != this_thread::get_id());
        });
        m_id = this_thread::get_id();
        m_is_locked = true;
    }

    void unlock() {
        std::unique_lock<std::mutex> lock(m_cond_mutex);
        if (!m_is_locked || m_id != this_thread::get_id())
            return;

        m_count--;
        m_is_locked = false;
        m_cond.notify_all();
    }
};

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

    void lock() {

        if (!m_is_locked) {
            m_count = 1;

            m_shared_lock.lock();
            m_is_locked = true;
        } else {
            m_count++;
            if (m_count >= m_maxCount) {
                unlock();
                lock();
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
            countDown.lock();
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
    cout << name << (useCountdown ? " with countdown" : " without countdown") << ": " << n << " threads." << endl;

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
    cout << "Switched threads: " << switched_count << "\nNumber: " << number << "\n" << endl;
}

int main()
{
    test<PoliteLock>("PoliteLock Test", true, 20);
//    test<mutex>("mutex Test", 20);

    return 0;
}