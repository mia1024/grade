# Grade (gradescope without scope)

Experimental project. Stabilities very much not guaranteed. Tested on Arch Linux with Python3.9.

## Dependencies

- python 3.8+
- node 14+

## Run

```sh
cd electron
npm i 
# if you have yarn installed, you should use `yarn install` instead
cd ..
python3 -m pip install -r requirements.txt 
python3 main.py
```

Example output:
```
------------------------------------------------------------------------------
                     Assignments due on Saturday, Feb 20                      
Homework 4A (HMC Math 73 SP21): 22:00 PM
------------------------------------------------------------------------------
                      Assignments due on Monday, Feb 22                       
PreClass 9.4 (HMC Chemistry 23B SP21): 10:00 AM
Quiz 4 (HMC Chemistry 23B SP21): 10:00 AM
Homework 4 Code: nj.py (Bio 52): 23:59 PM
Homework 4 Written: hivTree.pdf (Bio 52): 23:59 PM
------------------------------------------------------------------------------
                      Assignments due on Tuesday, Feb 23                      
HW 04 (HMC Physics 24A SP21): 10:00 AM
------------------------------------------------------------------------------
                     Assignments due on Wednesday, Feb 24                     
PreClass 9.5 (HMC Chemistry 23B SP21): 10:00 AM
Homework 4 (HMC Chemistry 23B SP21): 17:00 PM
------------------------------------------------------------------------------
                      Assignments due on Friday, Apr 23                       
Chem Study Consent Form (HMC Chemistry 23B SP21): 18:00 PM
```

## Note on course list and names

A file named `courses.json` will be generated under the repository root after running 
the program for the first time. Feel free to edit it and remove courses you don't care
about. In fact, you are encouraged to remove those courses to conserve bandwidths. If 
you want to change the display name of the course in the output , simply change the 
`name` field in the json file. 

## Note on Electron

The primary purpose of electron at this stage is to determine the cookies sent by Gradescope. 
If you don't want to install it for such a trivial purpose, you can manually create a file 
named `cookies.json` with a single key-value mapping of the cookies from gradescope, which you 
can extract from your browser. The file should look like this
```json
{
    "_ga": "[REDACTED]",
    "_gid": "[REDACTED]",
    "signed_token": "[REDACTED]",
    "remember_me": "[REDACTED]",
    "_gradescope_session": "[REDACTED]"
}
```