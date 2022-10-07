rm -rf Stabler  # Remove Stabler if it exists
git clone https://github.com/ittagnelli/Stabler.git # Clone latest Stabler
find ./Stabler -mindepth 1 -name src -prune -o -exec rm -rf {} \;   # Remove all except src/lib
mv Stabler/src/lib/* Stabler    # Move all files in lib to Stabler
rm -rf Stabler/src  # Remove useless files