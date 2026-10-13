import subprocess,glob,re,json,sys,os
d=sys.argv[1]
labels=re.compile(r'^(A WORKED EXAMPLE|GUIDED PRACTICE|INDEPENDENT PRACTICE|CORE PRACTICE|CHECK YOUR UNDERSTANDING|FICTIONAL TEACHING ILLUSTRATION|DOCUMENTED HISTORICAL DATA|THE IDEA TO KEEP|[A-Z][A-Z ]{3,40} PRACTICE)$')
rows=[]
for f in sorted(glob.glob(d+'/*.pdf')):
    n=int(re.search(r'Pages:\s+(\d+)',subprocess.run(['pdfinfo',f],capture_output=True,text=True).stdout).group(1))
    full=subprocess.run(['pdftotext','-layout',f,'-'],capture_output=True,text=True).stdout
    issues=[]
    for i in range(1,n+1):
        t=subprocess.run(['pdftotext','-f',str(i),'-l',str(i),f,'-'],capture_output=True,text=True).stdout
        lines=[l.strip() for l in t.splitlines() if l.strip()]
        if not lines: issues.append(f'p{i}:no-text'); continue
        if labels.match(lines[-1]): issues.append(f'p{i}:stranded "{lines[-1]}"')
    ans=bool(re.search(r'Answer: [A-E]\.',full))
    name=os.path.basename(f)
    if name.endswith('learner.pdf') and ans: issues.append('LEARNER HAS ANSWER')
    if name.endswith('answers.pdf') and not ans: issues.append('answers missing quiz answer (text)')
    rows.append((name,n,issues))
for name,n,iss in rows: print(f'{name:60s} {n:3d}  {"; ".join(iss)}')
