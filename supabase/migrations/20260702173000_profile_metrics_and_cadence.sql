alter table public.activities
add column if not exists cadence_spm int check (cadence_spm is null or cadence_spm > 0);

alter table public.profiles
add column if not exists age int check (age is null or (age >= 13 and age <= 100));

alter table public.profiles
add column if not exists sex text check (sex is null or sex in ('male', 'female'));

alter table public.profiles
add column if not exists weight_kg numeric(5,2) check (weight_kg is null or weight_kg > 0);
