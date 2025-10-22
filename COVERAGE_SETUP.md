# Coverage Enforcement Setup (80% Minimum)

## ✅ Automatic Coverage Checks

This project enforces **80% minimum code coverage** on all Pull Requests.

### How It Works

1. **Vitest Configuration** (`vitest.config.ts`)
   - Sets coverage thresholds: 80% for lines, functions, branches, and statements
   - Tests will **FAIL** if coverage drops below 80%

2. **GitHub Actions** (`.github/workflows/test.yml`)
   - Runs tests with coverage on every PR
   - Posts coverage report as PR comment
   - Blocks merge if coverage is below threshold

### Coverage Thresholds

```typescript
thresholds: {
  lines: 80,       // 80% of lines must be tested
  functions: 80,   // 80% of functions must be tested
  branches: 80,    // 80% of conditional branches must be tested
  statements: 80,  // 80% of statements must be tested
}
```

---

## 🔒 Enable Branch Protection on GitHub

To **enforce** this in your repository, follow these steps:

### Step 1: Go to Repository Settings

1. Navigate to: `https://github.com/thesagargoyal/task-manager`
2. Click **Settings** tab
3. Click **Branches** in the left sidebar

### Step 2: Add Branch Protection Rule

1. Click **Add branch protection rule**
2. In **Branch name pattern**, enter: `main`
3. Enable these options:

   ✅ **Require a pull request before merging**
   - Require approvals: 1 (optional, set to 0 if working solo)

   ✅ **Require status checks to pass before merging**
   - Click **Add** and search for: `test`
   - This ensures the "Run Tests" workflow must pass

   ✅ **Require branches to be up to date before merging**
   - Ensures PR has latest changes from main

   ✅ **Do not allow bypassing the above settings**
   - Prevents admins from skipping checks

4. Click **Create** or **Save changes**

### Step 3: Test It

1. Create a new branch:
   ```bash
   git checkout -b test-coverage-enforcement
   ```

2. Make a change that reduces coverage (e.g., add untested code)

3. Push and create a PR:
   ```bash
   git push -u origin test-coverage-enforcement
   ```

4. You'll see:
   - ❌ Test check fails if coverage < 80%
   - 🚫 **Merge** button is disabled
   - 💬 Coverage report posted as comment

---

## 📊 Check Coverage Locally

Before pushing your PR, check coverage:

```bash
npm run test:coverage
```

**Output example:**
```
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   92.5  |   87.3   |   95.1  |   92.8  |
  TaskManager.tsx     |   100   |   100    |   100   |   100   |
  TaskForm.tsx        |   95.2  |   88.5   |   100   |   95.5  |
  TaskList.tsx        |   90.1  |   82.3   |   91.7  |   90.4  |
----------------------|---------|----------|---------|---------|
```

If any column is < 80%, add more tests!

---

## 🎯 How to Improve Coverage

If your PR fails coverage check:

1. **Identify untested code:**
   ```bash
   npm run test:coverage
   open coverage/index.html  # Visual HTML report
   ```

2. **Red/yellow lines** = untested code

3. **Write tests** for those lines

4. **Run tests** again until >= 80%

---

## 🚫 What Gets Blocked

- ❌ PRs with coverage < 80%
- ❌ PRs with failing tests
- ❌ Direct pushes to `main` (must use PR)

## ✅ What's Allowed

- ✅ PRs with coverage >= 80%
- ✅ All tests passing
- ✅ Approved by reviewer (if required)

---

## 📝 Coverage Report in PRs

Every PR will automatically show:

```
Coverage Report

Total Coverage: 85.3%
✅ Lines: 85.2% (threshold: 80%)
✅ Functions: 87.1% (threshold: 80%)
✅ Branches: 82.5% (threshold: 80%)
✅ Statements: 85.0% (threshold: 80%)

All coverage thresholds met! ✨
```

---

## 🛠️ Adjusting Thresholds

To change the minimum coverage (e.g., to 90%):

**Edit `vitest.config.ts`:**
```typescript
thresholds: {
  lines: 90,
  functions: 90,
  branches: 90,
  statements: 90,
}
```

**Commit and push** - new threshold applies immediately!

---

## ❓ FAQ

**Q: What if I need to merge urgently?**  
A: Add more tests to reach 80%, or (not recommended) temporarily disable branch protection.

**Q: Can I exclude certain files from coverage?**  
A: Yes! Edit the `exclude` array in `vitest.config.ts`

**Q: How do I bypass this for config files?**  
A: They're already excluded (see `**/*.config.{ts,js}` in exclude list)

**Q: What if coverage was 90% and my PR drops it to 85%?**  
A: It will pass (85% > 80% threshold). Threshold is absolute, not relative.

---

## 🎉 Benefits

✅ **Code quality** - Forces comprehensive testing  
✅ **Bug prevention** - Catches untested edge cases  
✅ **Team standards** - Everyone maintains high coverage  
✅ **Confidence** - Know your code is well-tested  
✅ **Documentation** - Tests serve as usage examples  

---

Need help? Check the generated HTML report:
```bash
npm run test:coverage
open coverage/index.html
```
