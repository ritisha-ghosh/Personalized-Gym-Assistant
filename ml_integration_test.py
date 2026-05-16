import requests, time, json
BASE='http://127.0.0.1:5000'
email=f'test_ml_user_{int(time.time())}@example.com'
password='TestPass123!'
print('Signup ->', email)
signup_payload={
    'name':'ML Test User',
    'email':email,
    'password':password,
    'age':25,
    'weight':70,
    'height':175,
    'gender':'male',
    'goal':'muscle gain',
    'experience':'intermediate',
    'activityLevel':'moderate',
    'dietType':'vegetarian'
}
try:
    r=requests.post(BASE+'/api/auth/signup', json=signup_payload, timeout=10)
    print('SIGNUP', r.status_code, r.text)
except Exception as e:
    print('SIGNUP ERR', e)
    raise SystemExit(1)

# Login
try:
    r=requests.post(BASE+'/api/auth/login', json={'email':email,'password':password}, timeout=10)
    print('LOGIN', r.status_code, r.text)
    data=r.json()
    token=data.get('accessToken')
    if not token:
        print('No access token returned')
        raise SystemExit(1)
except Exception as e:
    print('LOGIN ERR', e)
    raise SystemExit(1)

headers={'Authorization': f'Bearer {token}'}
# Fetch diet plan
try:
    r=requests.get(BASE+'/api/diet-tracking/weekly-plan', headers=headers, timeout=10)
    print('DIET PLAN', r.status_code)
    try:
        print(json.dumps(r.json(), indent=2)[:1000])
    except:
        print(r.text[:1000])
except Exception as e:
    print('DIET ERR', e)

# Fetch workout plan
try:
    r=requests.get(BASE+'/api/workouts/weekly-plan', headers=headers, timeout=10)
    print('WORKOUT PLAN', r.status_code)
    try:
        print(json.dumps(r.json(), indent=2)[:1000])
    except:
        print(r.text[:1000])
except Exception as e:
    print('WORKOUT ERR', e)
