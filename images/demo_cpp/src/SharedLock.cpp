// C++ program to illustrate the thread synchronization using mutex
#include <iostream>
#include <thread>
#include <cassert>
#include <condition_variable>

using namespace std;

// import mutex from C++ standard library
#include <mutex>

// Shared resource
int number = 0;
thread::id id;

// C++ implementation of the above approach
#include <condition_variable>
#include <iostream>
#include <mutex>
#include <queue>

class NiceShareLock {
    std::mutex m_mutex;

    std::condition_variable m_cond;
    std::mutex m_cond_mutex;
    bool m_cond_value = true;
    thread::id m_id;
    int m_count = 0;


public:
    void lock() {
        std::unique_lock<std::mutex> lock(m_cond_mutex);
        m_count++;
        m_cond.wait(lock, [this]() {
            return m_cond_value && (m_count == 1 || m_id != this_thread::get_id());
        });
        m_mutex.lock();
        m_id = this_thread::get_id();
        m_cond_value = false;
    }

    void unlock() {
        m_count--;
        m_mutex.unlock();
        std::unique_lock<std::mutex> lock(m_cond_mutex);
        m_cond_value = true;
        m_cond.notify_all();
    }
};

class LockCountdown {
    int m_maxCount = 0;
    int m_count = 0;
    bool m_is_locked = false;

    NiceShareLock &m_shared_lock;


public:
    LockCountdown(NiceShareLock& sl, int n) : m_shared_lock(sl), m_maxCount(n) {
        assert(m_maxCount > 0);
    };

    void hold_lock() {

        if (!m_is_locked) {
            m_count = 1;

            m_shared_lock.lock();
            m_is_locked = true;
            if (this_thread::get_id() != id) {
                cout << "Switched threads" << endl;
                id = this_thread::get_id();
            }
        } else {
            m_count++;
            if (m_count >= m_maxCount) {
                unlock();
                hold_lock();
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

// function to increment the number
void increment(NiceShareLock& sl){
    LockCountdown ml(sl, 13);
    // increment number by 1 for 1000000 times
    for(int i=0; i<1000; i++){
        // Lock the thread using hold_lock
        ml.hold_lock();
        this_thread::sleep_for(chrono::milliseconds(1));
        number++;
    }
}

int main()
{
    NiceShareLock sl;

    // Create thread t1 to perform increment()
    thread t1(increment, ref(sl));

    // Create thread t2 to perform increment()
    thread t2(increment, ref(sl));

    // Start both threads simultaneously
    t1.join();
    t2.join();

    // Print the number after the execution of both threads
    std::cout<<"Number after execution of t1 and t2 is "<<number;

    return 0;
}