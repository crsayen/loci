import json


with open('./loci.json', 'r') as f:
    d = json.load(f)

a = []
for k, v in d.items():
    print(k, v, type(v))
    if isinstance(v, list):
        a.append({"name": k, "loci": [{"locus": i["locus"], "count": i.get(
            "count", 1)} for i in v], "description": ""})
    else:
        a.append({"name": k, "loci": [{"locus": v["locus"], "count": v.get(
            "count", 1)}], "description": v.get("description", "")})

with open("./loci_list.json", "w+") as f:
    json.dump(a, f, indent=2)
